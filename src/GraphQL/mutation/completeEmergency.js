import gql from 'graphql-tag';

const completeEmergency = gql`
  mutation CompleteEmergency($emergencyID: String!) {
    completeEmergency(input: { emergencyID: $emergencyID }) {
      code
      message
    }
  }
`;
export default completeEmergency;
