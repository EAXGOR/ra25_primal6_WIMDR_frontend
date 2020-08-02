import gql from 'graphql-tag';

const signin = gql`
  mutation Signin($email: String!, $password: String!, $lat: String!, $lng: String!) {
    signin(
      input: { email: $email, password: $password, location: { latitude: $lat, longitude: $lng } }
    ) {
      code
      message
    }
  }
`;
export default signin;
