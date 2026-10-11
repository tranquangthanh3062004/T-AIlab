# Observability & Metrics Guide — AI Learning OS

**Version**: 1.0.0  
**Status**: Active  
**Author**: DevOps/SRE Engineer

---

## 1. Structured Logging
All backend logs are formatted with ISO timestamps, component tags, and sanitized request contexts. Private credentials, user passwords, and full source code files are never logged.

### Monitored Metrics
- API Request Latency (p50, p95, p99)
- News Radar ingestion success, lag, and deduplication rates
- Code execution durations, timeout frequencies, and AST rejection counts
- AI Tutor retrieval relevance and citation validation pass rates
- Database query latency and connection pool health
