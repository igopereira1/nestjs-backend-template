import { Module } from '@nestjs/common';
import { AdminSettingsModule } from './admin-settings/admin-settings.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';

@Module({
  imports: [AdminSettingsModule, AdminUsersModule, AdminDashboardModule],
})
export class AdminModule {}
