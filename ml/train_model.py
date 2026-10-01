import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)


# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "datasets",
    "phishing.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)

os.makedirs(MODEL_DIR, exist_ok=True)


# -----------------------------
# Load dataset
# -----------------------------
print("Loading dataset...")

df = pd.read_csv(DATASET_PATH)

print(f"Dataset shape: {df.shape}")
print(f"Columns: {len(df.columns)}")


# -----------------------------
# Prepare features and target
# -----------------------------
X = df.drop(columns=["class", "Index"])
y = df["class"]


# Dataset uses:
# -1 = phishing
#  1 = legitimate
#
# Convert target to:
# 1 = phishing
# 0 = legitimate

y = y.apply(lambda value: 1 if value == -1 else 0)


print("\nTarget distribution:")
print(y.value_counts())


# -----------------------------
# Train / Test Split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)


print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# -----------------------------
# Train Random Forest
# -----------------------------
print("\nTraining Random Forest model...")

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced",
)

model.fit(X_train, y_train)


# -----------------------------
# Predictions
# -----------------------------
y_pred = model.predict(X_test)


# -----------------------------
# Evaluation
# -----------------------------
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)


print("\n==============================")
print("THREATLENS AI MODEL RESULTS")
print("==============================")

print(f"Accuracy : {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print(f"F1 Score : {f1:.4f}")

print("\nClassification Report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=["Legitimate", "Phishing"]
))

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))


# -----------------------------
# Save model
# -----------------------------
model_path = os.path.join(
    MODEL_DIR,
    "phishing_model.pkl"
)

joblib.dump(model, model_path)


# Save feature names
feature_path = os.path.join(
    MODEL_DIR,
    "feature_names.pkl"
)

joblib.dump(list(X.columns), feature_path)


print("\n==============================")
print("MODEL SAVED SUCCESSFULLY")
print("==============================")

print(f"Model: {model_path}")
print(f"Features: {feature_path}")