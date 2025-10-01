import { SetMetadata } from '@nestjs/common';

export const REQUIRE_OWNERSHIP_KEY = 'requireOwnership';
export const RequireOwnership = () => SetMetadata(REQUIRE_OWNERSHIP_KEY, true);
