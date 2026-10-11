import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.entities import WorkspaceProject, ProjectFile, ExperimentRun
from app.schemas.workspace import (
    WorkspaceProjectSchema, ProjectFileSchema,
    DatasetSummary, ExperimentRunSchema
)

DEFAULT_PROJECT_ID = "proj-default-starter"

def seed_starter_project(db: Session) -> WorkspaceProject:
    existing = db.query(WorkspaceProject).filter(WorkspaceProject.id == DEFAULT_PROJECT_ID).first()
    if existing:
        return existing

    project = WorkspaceProject(
        id=DEFAULT_PROJECT_ID,
        name="Linear Classifier & Gradient Descent Studio",
        description="Production starter project for testing linear decision boundaries and gradient descent optimization."
    )
    db.add(project)

    # Seed Project Files
    file_main = ProjectFile(
        id="file-main-py",
        project_id=DEFAULT_PROJECT_ID,
        name="main.py",
        content="""# AI Learning OS: Engineering Workspace
# Demonstration of 2D Linear Classifier with Gradient Descent

import math

def sigmoid(z: float) -> float:
    return 1.0 / (1.0 + math.exp(-max(min(z, 20.0), -20.0)))

def predict_sample(x1: float, x2: float, w1: float, w2: float, b: float) -> float:
    return sigmoid(w1 * x1 + w2 * x2 + b)

# Synthetic test points: (x1, x2, true_label)
dataset = [
    (1.2, 0.8, 1),
    (0.4, 0.2, 0),
    (1.5, 1.1, 1),
    (-0.2, -0.5, 0),
    (2.0, 1.8, 1),
    (-1.0, -1.2, 0)
]

w1, w2, b = 0.5, -0.2, 0.0
lr = 0.1

print("--- Initializing Training Loop ---")
for epoch in range(1, 11):
    total_loss = 0.0
    for x1, x2, y in dataset:
        p = predict_sample(x1, x2, w1, w2, b)
        err = p - y
        total_loss += - (y * math.log(max(p, 1e-7)) + (1 - y) * math.log(max(1 - p, 1e-7)))
        # Gradients
        w1 -= lr * err * x1
        w2 -= lr * err * x2
        b  -= lr * err

    if epoch % 2 == 0:
        print(f"Epoch {epoch:02d} | Cross-Entropy Loss: {total_loss / len(dataset):.4f} | w1: {w1:.3f}, w2: {w2:.3f}, b: {b:.3f}")

print("\\n[SUCCESS] Model training loop completed successfully!")
""",
        language="python"
    )

    file_utils = ProjectFile(
        id="file-utils-py",
        project_id=DEFAULT_PROJECT_ID,
        name="metrics.py",
        content="""# Model Evaluation Metrics Helper

def compute_accuracy(y_true: list[int], y_pred: list[int]) -> float:
    if not y_true:
        return 0.0
    correct = sum(1 for yt, yp in zip(y_true, y_pred) if yt == yp)
    return round(correct / len(y_true), 4)

def confusion_matrix(y_true: list[int], y_pred: list[int]) -> dict:
    tp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 1)
    tn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 0 and yp == 0)
    fp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 0 and yp == 1)
    fn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == 1 and yp == 0)
    return {"TP": tp, "TN": tn, "FP": fp, "FN": fn}
""",
        language="python"
    )

    file_data = ProjectFile(
        id="file-data-csv",
        project_id=DEFAULT_PROJECT_ID,
        name="training_samples.csv",
        content="""feature_x1,feature_x2,category_label,customer_id
1.2,0.8,1,cust_101
0.4,0.2,0,cust_102
1.5,1.1,1,cust_103
-0.2,-0.5,0,cust_104
2.0,1.8,1,cust_105
-1.0,-1.2,0,cust_106
0.8,0.9,1,cust_107
-0.5,-0.1,0,cust_108
""",
        language="csv"
    )

    db.add(file_main)
    db.add(file_utils)
    db.add(file_data)

    # Seed baseline experiment runs
    exp1 = ExperimentRun(
        id="exp-run-001",
        project_id=DEFAULT_PROJECT_ID,
        name="Baseline Logistic Regression",
        model_name="Linear Sigmoid",
        hyperparameters_json=json.dumps({"learning_rate": 0.1, "epochs": 10, "optimizer": "SGD"}),
        metrics_json=json.dumps({"accuracy": 0.875, "log_loss": 0.321, "f1_score": 0.88}),
        status="COMPLETED"
    )
    exp2 = ExperimentRun(
        id="exp-run-002",
        project_id=DEFAULT_PROJECT_ID,
        name="Tuned SGD with L2 Regularization",
        model_name="Regularized Linear",
        hyperparameters_json=json.dumps({"learning_rate": 0.05, "epochs": 25, "lambda_l2": 0.01}),
        metrics_json=json.dumps({"accuracy": 0.950, "log_loss": 0.214, "f1_score": 0.94}),
        status="COMPLETED"
    )
    db.add(exp1)
    db.add(exp2)

    db.commit()
    db.refresh(project)
    return project

def get_dataset_summary(csv_content: str) -> DatasetSummary:
    lines = [line.strip() for line in csv_content.strip().split("\n") if line.strip()]
    if not lines:
        return DatasetSummary(name="dataset.csv", rows=0, columns=[], column_types={}, missing_counts={}, sample_data=[])

    headers = [h.strip() for h in lines[0].split(",")]
    rows_data = []
    missing_counts = {h: 0 for h in headers}

    for line in lines[1:]:
        vals = [v.strip() for v in line.split(",")]
        row_dict = {}
        for i, h in enumerate(headers):
            val = vals[i] if i < len(vals) else ""
            if val == "":
                missing_counts[h] += 1
            row_dict[h] = val
        rows_data.append(row_dict)

    column_types = {}
    for h in headers:
        # Check if numeric
        is_num = True
        for r in rows_data:
            val = r.get(h, "")
            if val:
                try:
                    float(val)
                except ValueError:
                    is_num = False
                    break
        column_types[h] = "Float / Numeric" if is_num else "String / Categorical"

    return DatasetSummary(
        name="training_samples.csv",
        rows=len(rows_data),
        columns=headers,
        column_types=column_types,
        missing_counts=missing_counts,
        sample_data=rows_data[:20]
    )
