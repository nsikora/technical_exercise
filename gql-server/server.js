var	express = require('express');
var	express_graphql = require('express-graphql');
var	{buildSchema} = require('graphql');

//GraphQL Schema
var schema = buildSchema(`
  type Query {
	  information(id: Int!): Book
      availability(quantity: Int!): Book
	  booking(id: Int!, quantity: Int!): Book
 	  unbooking(id: Int!, quantity: Int!): Book
  }
  type Book {
	id: Int,
	author: String,
	title: String,
	release: String,
	summary: String,
	quantity: Int
  }
`);
var	booksData = [
	{
		id: 1,
		author: "Victor Hugo",
		title: "Claude Gueux",
		release: "06/07/1834",
		summary: "Claude Gueux, un modeste ouvrier, vit en concubinage avec une jeune fille et l’enfant de celle-ci. C’est un homme habile et intelligent mais analphabète et sans éducation. Un hiver pendant lequel le travail se fait trop rare, la petite famille souffre de la faim et du froid. Claude se résout à voler pour vivre. Le maigre butin permet à la femme et à l’enfant de vivre de pain et de se réchauffer, pendant trois jours. L’homme récolte malheureusement cinq ans de prison, peine à purger à la maison centrale de Clairvaux.",
		quantity: 0
	},
	{
		id: 2,
		author: "Guy de Maupassant",
		title: "Le Horla",
		release: "26/10/1886",
		summary: "sous la forme d un journal, Maupassant nous rapporte les hallucinations d un homme obsédé par la mystérieuse présence d un être surnaturel auquel il donne le nom de Horla. Ce Horla serait une sorte d incube, qui posséderait toutefois un corps, fait d une matière invisible et impalpable lui permettant d échapper à toute investigation des sens.  Cet être surnaturel est capable de raisonnement, tout comme les hommes : c est en fait une manière de surhomme qui s empare du premier venu, lui impose sa propre volonté, jusqu à en faire son esclave et absorbe, à son bénéfice, toute l énergie vitale de sa victime...",
		quantity: 1
	},
	{
		id: 3,
		author: "Emile Zola",
		title: "L assommoir",
		release: "13/04/1876",
		summary: "L Assommoir raconte la grandeur puis la décadence de Gervaise Macquart, blanchisseuse dans le quartier de la Goutte-d'Or à Paris.",
		quantity: 1
	}
]

var	getInformation = function(args) {
	var id = args.id;
	return booksData.filter(information => {
		return information.id == id;
	})[0];
}

var	getAvailability = function() {
	var	quantity = 1;
	return booksData.filter(information => information.quantity === 1)[0];
}

var	getBooking = function(args) {
	var	id = args.id;
	var	quantity = args.quantity;
	return booksData.filter(information => {
		if (information.quantity >= quantity) {
			return information.quantity == (information.quantity--) && information.id == id;
		}
		else {
			return information.quantity == (information.quantity) && information.id == id;
		}
	})[0];
}

var getUnbooking = function(args) {
	var	id = args.id
	var quantity = args.quantity
	return booksData.filter(information => {
		 if (information.quantity == 0) {
			return information.quantity == (information.quantity++) && information.id == id;
		}
		else {
			return information.quantity == (information.quantity) && information.id == id;
		}
	})[0];
}

//Root resolver
var root = {
 	information: getInformation,
 	availability: getAvailability,
 	booking: getBooking,
 	unbooking: getUnbooking,
};
//Create an express server and a GraphQL endpoint
var	app = express();
app.use('/graphql', express_graphql(
	{
            schema: schema,
            rootValue: root,
	    graphiql: true
	}));

app.listen(4000, () => console.log('Express GraphQL Server now running on localhost localhost:4000/graphql'));
