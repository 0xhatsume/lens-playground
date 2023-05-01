import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const API_URL = 'https://api.lens.dev'

/* create the API client */
export const client = new ApolloClient({
    uri: API_URL,
    cache: new InMemoryCache()
})

/* define a GraphQL query  */
export const exploreProfiles = gql`
    query ExploreProfiles($limit:LimitScalar, $cursor:Cursor){
        exploreProfiles(request: { 
                sortCriteria: MOST_FOLLOWERS, 
                limit:$limit,
                cursor:$cursor }) 
        {
            items{
                id
                name
                bio
                handle
                picture {
                    ... on MediaSet {
                    original {
                        url
                    }
                    }
                }
                stats {
                    totalFollowers
                }
            }
            pageInfo{
                prev
                next
            }

        }
    }
`