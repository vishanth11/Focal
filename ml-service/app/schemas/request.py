"""
OMEN ML Service — Pydantic request/response schemas.
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List


# ─────────────────────────── Request models ───────────────────────────


class PredictRequest(BaseModel):
    """Payload for the /predict endpoint."""

    text: Optional[str] = Field(None, description="Job posting or email body text")
    url: Optional[str] = Field(None, description="URL to analyse (optional)")
    email_content: Optional[str] = Field(None, description="Raw email content (optional)")
    input_type: Optional[str] = Field(
        "job_posting",
        description="Type of input: job_posting | email | url",
    )

    @field_validator("text", "email_content", mode="before")
    @classmethod
    def strip_strings(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if v else v


class URLRequest(BaseModel):
    """Payload for the /analyze-url endpoint."""

    url: str = Field(..., description="Full URL to analyse")


class EmailRequest(BaseModel):
    """Payload for the /analyze-email endpoint."""

    email_content: str = Field(..., description="Raw email content (headers + body)")


# ─────────────────────────── Response models ──────────────────────────


class RedFlag(BaseModel):
    """A single detected red flag."""

    flag: str
    description: str
    severity: str  # "low" | "medium" | "high"
    evidence: Optional[str] = None


class PredictResponse(BaseModel):
    """Response from the /predict endpoint."""

    risk_score: int
    risk_level: str  # "low" | "medium" | "high"
    red_flags: List[RedFlag]
    confidence: float
    explanation: str


class URLAnalysisResponse(BaseModel):
    """Response from the /analyze-url endpoint."""

    domain: str
    domain_age_days: Optional[int] = None
    is_suspicious_tld: bool
    is_blacklisted: bool
    typosquatting_matches: List[str]
    risk_score: int
    red_flags: List[RedFlag]


class EmailAnalysisResponse(BaseModel):
    """Response from the /analyze-email endpoint."""

    sender_domain: Optional[str] = None
    reply_to_domain: Optional[str] = None
    has_spf: bool
    has_dkim: bool
    has_dmarc: bool
    is_spoofed: bool
    risk_score: int
    red_flags: List[RedFlag]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str


class ModelInfoResponse(BaseModel):
    model_type: str
    accuracy: Optional[float] = None
    precision: Optional[float] = None
    recall: Optional[float] = None
    f1_score: Optional[float] = None
    trained_on: str
    training_date: Optional[str] = None
