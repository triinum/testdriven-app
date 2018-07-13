import { Selector, RequestLogger } from 'testcafe';
import { MyRequestHook, testApi } from './utils';

const TEST_URL = process.env.TEST_URL;

const logger = RequestLogger(`${TEST_URL}/users`, { logResponseBody: true });

fixture("/")
  .page(`${TEST_URL}/`);

test(`should display the page correctly if a user is not logged in`, async (t) => {
  await t
    .navigateTo(TEST_URL)
    .expect(Selector('H1').withText('All Users').exists).ok()
    .expect(Selector('a').withText('User Status').exists).notOk()
    .expect(Selector('a').withText('Log Out').exists).notOk()
    .expect(Selector('a').withText('Register').exists).ok()
    .expect(Selector('a').withText('Log In').exists).ok()
});
