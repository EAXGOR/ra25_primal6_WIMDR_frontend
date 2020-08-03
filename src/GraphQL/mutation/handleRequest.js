import gql from 'graphql-tag';

const handleEmergency = gql`
  mutation HandleEmergency($emergencyID: String!) {
    handleEmergency(input: { emergencyID: $emergencyID }) {
      code
      message
    }
  }
`;
export default handleEmergency;
