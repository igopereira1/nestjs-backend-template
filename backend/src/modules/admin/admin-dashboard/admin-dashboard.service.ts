import { Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    const totalUsers = await this.prisma.user.count({
      where: { role: 'USER' },
    });

    const activeUsers = await this.prisma.user.count({
      where: { role: 'USER', status: { not: UserStatus.INACTIVE } },
    });

    const usersByMonth: { month: number; total: number }[] =
      await this.prisma.user
        .groupBy({
          by: ['createdAt'],
          where: { role: 'USER' },
          _count: { _all: true },
          orderBy: { createdAt: 'asc' },
        })
        .then((results) => {
          const aggregated = new Map<number, number>();
          results.forEach((result) => {
            const month = result.createdAt.getMonth() + 1;
            aggregated.set(
              month,
              (aggregated.get(month) ?? 0) + result._count._all,
            );
          });
          return Array.from(aggregated.entries()).map(([month, total]) => ({
            month,
            total,
          }));
        });

    const chartLabels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const usersPerMonth = chartLabels.map((_, i) => {
      const found = usersByMonth.find((u) => u.month === i + 1);
      return found ? found.total : 0;
    });

    return {
      totalUsers,
      activeUsers,
      chart: {
        labels: chartLabels,
        data: usersPerMonth,
      },
    };
  }
}
