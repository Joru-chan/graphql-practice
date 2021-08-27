const { GraphQLInt, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql')
const fetch = require('node-fetch')
// const util = require('util')
// const parseXML = util.promisify(require('xml2js').parseString)  // if xml result from API uses callbacks, not promises, so util makes it a promise

/*
fetch(
  'http://www.boredapi.com/api/activity/'
).then((res) => res.json()) // if xml result, res.text()
// .then(parseXML)
*/

const FilmType = new GraphQLObjectType({
  name: 'Film',
  description: '...',
  
  fields: () => ({
    title: {
      type: GraphQLString,
      // How to extract the name from the data?
      resolve: json =>        // first argument is what's returned from the fetch 
      json.title
    },
    original_title: {
      type: GraphQLString,
      resolve: json =>
        json.original_title
    },
    people: {
      type: GraphQLList(People),
      resolve: json => {
        return Promise.all(json.people.map(char => 
          fetch(char)
            .then(res => res.json())
        ))
      }
    }
  })
})
const People = new GraphQLObjectType({
  name: 'People',
  description: '...',
  
  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: json => json.name
    },
    gender: {
      type: GraphQLString,
      resolve: json => json.gender
    }
  })
})

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
      film: {
        type: FilmType,
        args: {
          id: { type: GraphQLString }
        },
        resolve: (root, args) => fetch(                            // Fn that graphQL will use to fetch the data
          `https://ghibliapi.herokuapp.com/films/${args.id}`
        ).then((res) => res.json()) 
      },
    })
  })
})



