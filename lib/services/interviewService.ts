import { interviewRepository, InterviewEvaluationRecord } from "../repositories/InterviewRepository";
import { recruitmentRepository } from "../repositories/RecruitmentRepository";
import { auditRepository } from "../repositories/AuditRepository";
import { InterviewEvaluationInput, InterviewUpdateInput } from "../validation/interview";
import { RepositoryQueryResult } from "../repositories/types";

export class InterviewService {
  /**
   * Computes the weighted overall score:
   * Technical (35%) + Problem Solving (30%) + Communication (20%) + Team Fit (15%)
   */
  public computeWeightedScore(scores: {
    technicalScore: number;
    problemSolvingScore: number;
    communicationScore: number;
    teamFitScore: number;
  }): number {
    const weighted =
      scores.technicalScore * 0.35 +
      scores.problemSolvingScore * 0.3 +
      scores.communicationScore * 0.2 +
      scores.teamFitScore * 0.15;
    return Math.round(weighted * 10) / 10;
  }

  public async getEvaluations(candidateId?: string): Promise<RepositoryQueryResult<InterviewEvaluationRecord[]>> {
    return interviewRepository.getInterviews(candidateId);
  }

  public async submitEvaluation(
    input: InterviewEvaluationInput,
    actor: { username: string; role: string }
  ): Promise<RepositoryQueryResult<InterviewEvaluationRecord>> {
    const overallScore = this.computeWeightedScore({
      technicalScore: input.technicalScore,
      problemSolvingScore: input.problemSolvingScore,
      communicationScore: input.communicationScore,
      teamFitScore: input.teamFitScore,
    });

    const enrichedInput: InterviewEvaluationInput = {
      ...input,
      overallScore,
    };

    const result = await interviewRepository.createInterview(enrichedInput);

    if (result.success && result.data) {
      // Automatically advance candidate status to INTERVIEW if currently in SCREENING / SHORTLISTED
      if (input.candidateId && !input.candidateId.startsWith("mock-")) {
        await recruitmentRepository.updateApplicationStatus(
          input.candidateId,
          "INTERVIEW",
          `Interview ${input.round} evaluated: Score ${overallScore}/10 (${input.recommendation})`,
          input.interviewer
        );
      }

      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "INTERVIEW_EVALUATION_SUBMITTED",
        resource: "InterviewEvaluation",
        resourceId: result.data.id,
        details: {
          candidateName: input.candidateName,
          round: input.round,
          overallScore,
          recommendation: input.recommendation,
        },
      });
    }

    return result;
  }

  public async updateEvaluation(
    id: string,
    updates: InterviewUpdateInput,
    actor: { username: string; role: string }
  ): Promise<RepositoryQueryResult<InterviewEvaluationRecord>> {
    const result = await interviewRepository.updateInterview(id, updates);

    if (result.success) {
      await auditRepository.logEvent({
        actor: actor.username,
        role: actor.role,
        action: "INTERVIEW_EVALUATION_UPDATED",
        resource: "InterviewEvaluation",
        resourceId: id,
        details: updates,
      });
    }

    return result;
  }
}

export const interviewService = new InterviewService();
