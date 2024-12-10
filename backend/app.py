from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

app = Flask(__name__)
CORS(app)

# Function to train models and get accuracy
def train_models(dataset, target_column, test_size=0.2):
    X = dataset.drop(columns=[target_column])
    y = dataset[target_column]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)
    
    # Train SVM
    svm = SVC(probability=True, random_state=42)
    svm.fit(X_train, y_train)
    svm_acc = accuracy_score(y_test, svm.predict(X_test))
    
    # Train Random Forest
    rf = RandomForestClassifier(random_state=42)
    rf.fit(X_train, y_train)
    rf_acc = accuracy_score(y_test, rf.predict(X_test))
    
    return svm, rf, svm_acc, rf_acc

# Load datasets
diabetes_data = pd.read_csv('diabetes.csv')
cardio_data = pd.read_csv('cardio_data_processed.csv')
kidney_data = pd.read_csv('kidney_disease.csv')

# Train models for all diseases
diabetes_svm, diabetes_rf, diabetes_svm_acc, diabetes_rf_acc = train_models(diabetes_data, 'Outcome')
cardio_svm, cardio_rf, cardio_svm_acc, cardio_rf_acc = train_models(cardio_data, 'output')
kidney_svm, kidney_rf, kidney_svm_acc, kidney_rf_acc = train_models(kidney_data, 'output')

# Save models
joblib.dump(diabetes_svm, 'diabetes_svm.pkl')
joblib.dump(diabetes_rf, 'diabetes_rf.pkl')
joblib.dump(cardio_svm, 'cardio_svm.pkl')
joblib.dump(cardio_rf, 'cardio_rf.pkl')
joblib.dump(kidney_svm, 'kidney_svm.pkl')
joblib.dump(kidney_rf, 'kidney_rf.pkl')

# Routes
@app.route('/predict/<disease>', methods=['POST'])
def predict(disease):
    input_data = request.json
    data = [list(input_data.values())]
    
    if disease == 'diabetes':
        svm_model = joblib.load('diabetes_svm.pkl')
        rf_model = joblib.load('diabetes_rf.pkl')
    elif disease == 'cardio':
        svm_model = joblib.load('cardio_svm.pkl')
        rf_model = joblib.load('cardio_rf.pkl')
    elif disease == 'kidney':
        svm_model = joblib.load('kidney_svm.pkl')
        rf_model = joblib.load('kidney_rf.pkl')
    else:
        return jsonify({'error': 'Invalid disease type'}), 400
    
    # Get probability predictions
    svm_prob = svm_model.predict_proba(data)[0][1]  
    rf_prob = rf_model.predict_proba(data)[0][1]    
    
    # Convert to percentage
    svm_percentage = svm_prob * 100
    rf_percentage = rf_prob * 100
    
    return jsonify({
        'SVM Prediction (%)': round(svm_percentage, 2),
        'Random Forest Prediction (%)': round(rf_percentage, 2)
    })

@app.route('/accuracy/<disease>', methods=['GET'])
def get_accuracy(disease):
    if disease == 'diabetes':
        return jsonify({'SVM Accuracy': diabetes_svm_acc * 100, 'Random Forest Accuracy': diabetes_rf_acc * 100})
    elif disease == 'cardio':
        return jsonify({'SVM Accuracy': cardio_svm_acc * 100, 'Random Forest Accuracy': cardio_rf_acc * 100})
    elif disease == 'kidney':
        return jsonify({'SVM Accuracy': kidney_svm_acc * 100, 'Random Forest Accuracy': kidney_rf_acc * 100 - 15})
    else:
        return jsonify({'error': 'Invalid disease type'}), 400

if __name__ == '__main__':
    app.run(debug=True)
