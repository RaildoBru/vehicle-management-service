require('dotenv').config();

import { listen } from './app';

const PORT = process.env.PORT || 3000;

listen(PORT, () => {
  console.log(
    `🚀 Vehicle Management Service running on port ${PORT}`
  );
});