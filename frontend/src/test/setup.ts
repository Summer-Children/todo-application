import '@testing-library/jest-dom';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
mock.onGet('/some-endpoint').reply(200, { data: 'mocked data' });
mock.onPost('/some-endpoint').reply(201, { success: true });
