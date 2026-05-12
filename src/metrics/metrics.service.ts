import { Injectable } from '@nestjs/common';
import { CpmQueryDto } from './dto/cpm-query.dto';
import { EngagementQueryDto } from './dto/engagement-query.dto';

@Injectable()
export class MetricsService {
  calculateEngagement(query: EngagementQueryDto) {
    return {
      rate: ((query.likes + query.comments) / query.followers) * 100,
    };
  }

  calculateCpm(query: CpmQueryDto) {
    return {
      cpm: (query.cost / query.impressions) * 1000,
    };
  }
}
