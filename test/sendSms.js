import chai from 'chai';
import SMS from '../app/utils/sendSms';
import Constants from '../app/utils/constants';

const { expect } = chai;

const user = Constants.TEST_DUMMY_USER;
const incident = Constants.TEST_DUMMY_INCIDENT;
let sms;

describe('SMS class', () => {
  it('should have correct message for the rejected incidents', () => {
    incident.status = Constants.INCIDENT_STATUS_REJECTED;
    sms = new SMS(user, incident);
    expect(sms.message).to.equal(`Hello ${user.firstname}, your report #${incident.id} has been rejected because we could not verify your claim.`);
  });
  it('should have correct message for the resolved incidents', () => {
    incident.status = Constants.INCIDENT_STATUS_RESOLVED;
    sms = new SMS(user, incident);
    expect(sms.message).to.equal(`Hello ${user.firstname}, your report #${incident.id} has been resolved. You may confirm and give us feedback.`);
  });
  it('should have correct message for the incidents under investigation', () => {
    incident.status = Constants.INCIDENT_STATUS_UNDER_INVESTIGATION;
    sms = new SMS(user, incident);
    expect(sms.message).to.equal(`Hello ${user.firstname}, your report ${incident.id} is currently under investigation. You will continue to get feedback from us as we progress.`);
  });
});
