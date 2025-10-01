import { SetMetadata } from '@nestjs/common';

export const REQUIRE_SAME_COMPANY_KEY = 'requireSameCompany';
export const RequireSameCompany = () =>
  SetMetadata(REQUIRE_SAME_COMPANY_KEY, true);
