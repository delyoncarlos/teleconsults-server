const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const DbJoomlaAPI = require('./datasources/dbjoomla');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {startFileServer} = require('../fileServer');

const server = new ApolloServer({
	context: async ({ req }) => {
		console.log('requesting...');
		// simple auth check on every request
		const auth = req.headers && req.headers.authorization || '';
    	const username = Buffer.from(auth, 'base64').toString('ascii');
    	// find a user by their username
    	const user = await prisma.users.findOne({ where: { username } });
		if (!user) return { user: null };
		
    	return { user: { ...user } };
  	},
 	typeDefs,
	resolvers,
	dataSources: () => ({
		dbJoomlaAPI: new DbJoomlaAPI({ prisma })
  })
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

startFileServer();