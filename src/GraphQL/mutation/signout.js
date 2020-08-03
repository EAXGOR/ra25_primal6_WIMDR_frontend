import gql from 'graphql-tag';

const signout = gql`
  mutation SignOut {
    signout {
      code
      message
    }
  }
`;
export default signout;
