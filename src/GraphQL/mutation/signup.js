import gql from 'graphql-tag';

const signin = gql`
  mutation Signup(
    $email: String!
    $password: String!
    $name: String!
    $phone: String!
    $lat: String!
    $lng: String!
    $priority: Boolean!
  ) {
    signup(
      input: {
        email: $email
        password: $password
        name: $name
        phone: $phone
        location: { latitude: $lat, longitude: $lng }
        priority: $priority
      }
    ) {
      code
      message
    }
  }
`;
export default signin;
