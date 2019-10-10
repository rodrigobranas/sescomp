const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`

	type Item {
		id: Int
		category: String
		description: String
		price: Float
	}

	type Query {
		items: [Item]
	}

`;

const items = [
	{ id: 1, category: "Entradas", description: "Camarão a milanesa", price: 40 },
	{ id: 2, category: "Entradas", description: "Pastel de queijo", price: 15 },
	{ id: 3, category: "Entradas", description: "Casquinha de siri", price: 20 },
	{ id: 4, category: "Bebidas", description: "Suco", price: 10 },
	{ id: 5, category: "Bebidas", description: "Água", price: 5 },
	{ id: 6, category: "Bebidas", description: "Refrigerante", price: 8 }
];

const resolvers = {
	Query: {
		items() {
			return items;
		}
	}
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen();
