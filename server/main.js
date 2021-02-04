const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const neo4j = require('neo4j-driver');
const { v4: uuidv4 } = require('uuid');
var jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT;

const dotenv = require('dotenv');
dotenv.config();

const driver = neo4j.driver(process.env.DB_HOST, neo4j.auth.basic(process.env.DB_USERNAME, process.env.DB_PASSWORD));
const session = driver.session();

const { loggedIn, addUser } = require('./helpers/auth.middleware');

app 
    .use(bodyParser.json())
    .use(cors());

app.post('/register', async (req, res) => {
    const { nick, password } = req.body

    if (!nick || !password) 
        return res.status(400).send('No nick or password');

    const users = await session.run(
        'MATCH (u:TeczynskiUser) WHERE u.nick = $nick RETURN u',
        { nick }
    );

    if (users.records.length !== 0)
        return res.status(400).send('User of this username already exists.');

    const result = await session.run(
        'CREATE (u:TeczynskiUser {id: $id, nick: $nick, password: $password}) RETURN u',
        { id: uuidv4(), nick, password }
    )

    const singleRecord = result.records[0]
    const node = singleRecord.get(0)

    res.send(node.properties);
})

app.post('/login', async (req, res) => {
    const { nick, password } = req.body

    const user = await session.run(
        'MATCH (u:TeczynskiUser) WHERE u.nick = $nick RETURN u LIMIT 1',
        { nick }
    );

    if (!user.records[0])
        return res.status(400).send('Username of this nickname does not exist.');
    
    const rawUser = user.records[0].get(0).properties;
    
    if (rawUser.password !== password)
        return res.status(400).send('Incorrect password.');
    
    const token = jwt.sign(rawUser, 'secret', { expiresIn: "2h" });
    res.status(200).send(token);
})

app.get('/articles', addUser, async (req, res) => {
    const { username } = req.query;
    
    const result = await session.run(
        `MATCH (u:TeczynskiUser)-[:CONTAINS]->(a:TeczynskiArticle) 
        WHERE u.nick = $nick AND (a.isPublished = true OR u.id = $loggedUserId) 
        RETURN a
        ORDER BY a.createdAt DESC`,
        { nick: username, loggedUserId: req.user ? req.user.id : null }
    );

    res.send(result.records.map(record => record.get(0).properties));
})

app.get('/articles/:id', addUser, async (req, res) => {
    const { id } = req.params;
    
    const result = await session.run(
        'MATCH (u:TeczynskiUser)-[:CONTAINS]->(a:TeczynskiArticle) WHERE a.id = $articleId AND (a.isPublished = true OR u.id = $loggedUserId) RETURN a, u LIMIT 1',
        { articleId: id, loggedUserId: req.user ? req.user.id : null }
    );
    
    if (result.records.length === 0)
        return res.status(400).send('There is no article of this id');
    
    const obj = {
        article: result.records[0].get(0).properties,
        user: result.records[0].get(1).properties,
    };
    
    res.send(obj);
})

app.post('/articles', loggedIn, async (req, res) => {
    const { title, content, isPublished } = req.body
    
    if (!title || !content) 
        return res.status(400).send('No title or content');

    const article = await session.run(
        'CREATE (a:TeczynskiArticle {id: $id, title: $title, content: $content, isPublished: $isPublished, createdAt: $createdAt}) RETURN a',
        { id: uuidv4(), title, content, isPublished, createdAt: new Date().toString() }
    );

    await session.run(
        'MATCH (u:TeczynskiUser), (a:TeczynskiArticle) WHERE u.id = $userId AND a.id = $articleId CREATE (u)-[r: CONTAINS]->(a) RETURN type(r)',
        { userId: req.user.id, articleId: article.records[0].get(0).properties.id}
    );
    
    res.send(article.records[0].get(0).properties.id);
})

app.patch('/articles/:id', loggedIn, async (req, res) => {
    const { title, content, isPublished } = req.body
    const { id } = req.params;

    if (!title || !content) 
        return res.status(400).send('No title or content');

    await session.run(
        `MATCH (a:TeczynskiArticle { id: $id })
        SET a.title = $title, a.content = $content, a.isPublished = $isPublished
        RETURN a`,        
        { id, title, content, isPublished }
    );
    
    res.send(id);
})

app.delete('/articles/:id', loggedIn, async (req, res) => {
    const { id } = req.params;
    
    await session.run('MATCH (a:TeczynskiArticle) WHERE a.id = $id DETACH DELETE a', { id });

    res.send();
})

app.get('/users', async (req, res) => {    
    const result = await session.run(
        'MATCH(u:TeczynskiUser) RETURN u'
    );
    
    const users = result.records.map(record => record.get(0).properties);

    for (user of users) {
        const comments = await session.run(
            `MATCH(u:TeczynskiUser)-[:CONTAINS]->(a:TeczynskiArticle)-[:CONTAINS]->(c:TeczynskiComment) 
            WHERE u.id = $userId AND a.isPublished = true RETURN count(c)`,
            { userId: user.id }
        );
        const articles = await session.run(
            'MATCH(u:TeczynskiUser)-[:CONTAINS]->(a:TeczynskiArticle) WHERE u.id = $userId AND a.isPublished = true RETURN count(a)',
            { userId: user.id }
        );

        user['commentsCount'] = comments.records[0].get(0).low;
        user['articlesCount'] = articles.records[0].get(0).low;
    }

    const sortedUsers = users.sort((user1, user2) => {
        return user1.commentsCount + user1.articlesCount > user2.commentsCount + user2.articlesCount ? -1 : 1;
    })

    return res.send(sortedUsers);
})

app.get('/comments', async(req, res) => {
    const { articleId } = req.query;

    const result = await session.run(
        'MATCH (u:TeczynskiUser)-[:WROTE]->(c:TeczynskiComment)<-[:CONTAINS]-(a:TeczynskiArticle) WHERE a.id = $articleId RETURN c,u ORDER BY c.createdAt',
        { articleId }
    );

    const response = result.records.map(record => ({
        comment: record._fields[0].properties,
        author: record._fields[1].properties,
    }));

    return res.send(response);
})

app.post('/comments', loggedIn, async (req, res) => {
    const { id } = req.user;
    const { comment, articleId } = req.body;

    if (!comment)
        return res.status(404).send();
    
    const newComment = await session.run(
        'CREATE (c:TeczynskiComment {id: $id, content: $comment, createdAt: $createdAt}) RETURN c',
        { id: uuidv4(), comment, createdAt: new Date().toString() }
    );

    await session.run(
        'MATCH (a:TeczynskiArticle), (c:TeczynskiComment) WHERE a.id = $articleId AND c.id = $commentId CREATE (a)-[r: CONTAINS]->(c) RETURN type(r)',
        { articleId, commentId: newComment.records[0].get(0).properties.id }
    );

    await session.run(
        'MATCH (u:TeczynskiUser), (c:TeczynskiComment) WHERE u.id = $userId AND c.id = $commentId CREATE (u)-[r: WROTE]->(c) RETURN type(r)',
        { userId: id, commentId: newComment.records[0].get(0).properties.id }
    );

    return res.status(201).send();
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})