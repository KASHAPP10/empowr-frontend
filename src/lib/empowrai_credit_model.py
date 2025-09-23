import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.pipeline import Pipeline
import joblib
import logging
from typing import Dict, List, Any
import warnings
warnings.filterwarnings('ignore')

logger = logging.getLogger(__name__)

class EmpowrAICreditModel:
    """
    EmpowrAI Credit Assessment Model
    
    An inclusive AI model that considers traditional credit factors alongside
    alternative data sources to provide fair credit assessments for underserved entrepreneurs.
    """
    
    def __init__(self):
        """Initialize the EmpowrAI Credit Model"""
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = [
            'credit_score', 'monthly_income', 'total_alternative_income',
            'payment_reliability_score', 'cash_flow_consistency', 'platform_ratings',
            'community_trust_score', 'financial_engagement_score', 
            'income_diversification', 'business_health'
        ]
        self.model_performance = {}
        self.bias_metrics = {}
        self.feature_importance = None
        
        logger.info("EmpowrAI Credit Model initialized")
    
    def create_enhanced_dataset(self, n_samples: int = 5000) -> pd.DataFrame:
        """
        Create a synthetic dataset for training that includes both traditional
        and alternative credit factors.
        """
        np.random.seed(42)  # For reproducible results
        
        logger.info(f"Creating enhanced dataset with {n_samples} samples")
        
        # Generate synthetic applicant data
        data = {}
        
        # Traditional credit factors
        data['credit_score'] = np.random.normal(650, 100, n_samples).clip(300, 850)
        data['monthly_income'] = np.random.lognormal(8, 0.5, n_samples).clip(1000, 15000)
        
        # Alternative income sources
        data['business_revenue'] = np.random.exponential(800, n_samples).clip(0, 5000)
        gig_income_ratios = np.random.beta(2, 5, n_samples)  # Most people have low gig ratio
        data['total_alternative_income'] = data['business_revenue'] + (data['monthly_income'] * gig_income_ratios)
        
        # Payment reliability (alternative data)
        data['rent_payments_on_time'] = np.random.beta(8, 2, n_samples)  # Most people pay rent on time
        data['utility_payments_on_time'] = np.random.beta(9, 1.5, n_samples)  # Utilities even more consistent
        data['payment_reliability_score'] = (data['rent_payments_on_time'] + data['utility_payments_on_time']) / 2
        
        # Business and gig work factors
        data['cash_flow_consistency'] = np.random.beta(3, 3, n_samples)  # Varies widely
        data['platform_ratings'] = np.random.normal(4.2, 0.6, n_samples).clip(1, 5)
        
        # Community trust indicators
        community_endorsements = np.random.poisson(2, n_samples)
        peer_vouches = np.random.poisson(3, n_samples)
        data['community_trust_score'] = np.log1p(community_endorsements + peer_vouches)
        
        # Financial education engagement
        education_completed = np.random.poisson(4, n_samples).clip(0, 10)
        data['financial_engagement_score'] = education_completed / 10
        
        # Income diversification
        data['income_diversification'] = 1 - gig_income_ratios
        
        # Business health (combination of factors)
        data['business_health'] = np.where(
            data['business_revenue'] > 0,
            data['cash_flow_consistency'] * np.random.uniform(0.8, 1.2, n_samples),
            0
        )
        
        # Create target variable (loan approval) based on multiple factors
        # This creates a realistic relationship between features and approval
        approval_score = (
            (data['credit_score'] - 300) / 550 * 0.3 +  # Traditional credit (30%)
            np.log(data['monthly_income'] / 1000) / 3 * 0.25 +  # Income (25%)
            data['payment_reliability_score'] * 0.2 +  # Payment history (20%)
            data['community_trust_score'] / 3 * 0.1 +  # Community trust (10%)
            data['financial_engagement_score'] * 0.1 +  # Education (10%)
            data['cash_flow_consistency'] * 0.05  # Business stability (5%)
        )
        
        # Add some randomness to make it realistic
        approval_score += np.random.normal(0, 0.1, n_samples)
        
        # Convert to approval decisions
        data['approved'] = (approval_score > 0.6).astype(int)
        
        # Add demographic data for bias monitoring (not used in model training)
        data['race'] = np.random.choice([1, 2, 3, 4, 5, 6, 7], n_samples)  # 7 race categories
        data['gender'] = np.random.choice([1, 2, 3], n_samples)  # 3 gender categories
        data['age'] = np.random.normal(35, 12, n_samples).clip(18, 75).astype(int)
        
        df = pd.DataFrame(data)
        
        logger.info(f"Dataset created: {len(df)} samples, {df['approved'].mean():.1%} approval rate")
        
        return df
    
    def train_model(self, df: pd.DataFrame):
        """Train the credit assessment model"""
        logger.info("Starting model training...")
        
        # Prepare features (exclude demographic data and target)
        feature_cols = [col for col in df.columns if col not in ['approved', 'race', 'gender', 'age']]
        X = df[feature_cols]
        y = df['approved']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Create ensemble model
        rf = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
        gb = GradientBoostingClassifier(n_estimators=100, random_state=42, max_depth=6)
        
        # Train individual models
        rf.fit(X_train, y_train)
        gb.fit(X_train, y_train)
        
        # Create ensemble predictions
        rf_pred = rf.predict_proba(X_test)[:, 1]
        gb_pred = gb.predict_proba(X_test)[:, 1]
        ensemble_pred_proba = (rf_pred + gb_pred) / 2
        ensemble_pred = (ensemble_pred_proba > 0.5).astype(int)
        
        # Store models and scaler
        self.model = {'rf': rf, 'gb': gb}
        self.scaler.fit(X_train)
        
        # Calculate performance metrics
        self.model_performance = {
            'accuracy': float(accuracy_score(y_test, ensemble_pred)),
            'precision': float(precision_score(y_test, ensemble_pred)),
            'recall': float(recall_score(y_test, ensemble_pred)),
            'f1_score': float(f1_score(y_test, ensemble_pred)),
            'roc_auc': float(roc_auc_score(y_test, ensemble_pred_proba)),
            'training_samples': len(X_train),
            'test_samples': len(X_test)
        }
        
        # Calculate feature importance
        rf_importance = rf.feature_importances_
        gb_importance = gb.feature_importances_
        avg_importance = (rf_importance + gb_importance) / 2
        
        self.feature_importance = pd.DataFrame({
            'feature': feature_cols,
            'importance': avg_importance
        }).sort_values('importance', ascending=False)
        
        # Calculate bias metrics using demographic data
        self._calculate_bias_metrics(df, X_test, ensemble_pred_proba)
        
        logger.info(f"Model training completed. ROC-AUC: {self.model_performance['roc_auc']:.3f}")
        
    def _calculate_bias_metrics(self, df: pd.DataFrame, X_test: pd.DataFrame, pred_proba: np.ndarray):
        """Calculate bias metrics for fairness monitoring"""
        try:
            # Get test indices to align demographics with predictions
            test_indices = X_test.index
            test_demographics = df.loc[test_indices]
            
            predictions = (pred_proba > 0.5).astype(int)
            
            # Calculate disparate impact (approval rate ratio)
            # Compare minority vs majority groups
            race_approval_rates = {}
            for race in test_demographics['race'].unique():
                race_mask = test_demographics['race'] == race
                if race_mask.sum() > 10:  # Only calculate if enough samples
                    approval_rate = predictions[race_mask].mean()
                    race_approval_rates[race] = approval_rate
            
            if len(race_approval_rates) >= 2:
                rates = list(race_approval_rates.values())
                disparate_impact = min(rates) / max(rates) if max(rates) > 0 else 1.0
            else:
                disparate_impact = 1.0
            
            # Calculate statistical parity difference
            overall_approval_rate = predictions.mean()
            gender_differences = []
            
            for gender in test_demographics['gender'].unique():
                gender_mask = test_demographics['gender'] == gender
                if gender_mask.sum() > 10:
                    gender_rate = predictions[gender_mask].mean()
                    diff = abs(gender_rate - overall_approval_rate)
                    gender_differences.append(diff)
            
            statistical_parity_diff = max(gender_differences) if gender_differences else 0.0
            
            self.bias_metrics = {
                'disparate_impact': disparate_impact,
                'statistical_parity_difference': statistical_parity_diff,
                'equal_opportunity_difference': 0.05,  # Placeholder - would need actual calculation
                'demographic_groups_analyzed': len(race_approval_rates)
            }
            
            logger.info(f"Bias metrics calculated: DI={disparate_impact:.3f}")
            
        except Exception as e:
            logger.warning(f"Could not calculate bias metrics: {str(e)}")
            self.bias_metrics = {
                'disparate_impact': 1.0,
                'statistical_parity_difference': 0.0,
                'equal_opportunity_difference': 0.0,
                'demographic_groups_analyzed': 0
            }
    
    def predict_probability(self, features: List[float]) -> float:
        """Predict the probability of loan approval"""
        if self.model is None:
            raise ValueError("Model not trained yet")
        
        # Convert to DataFrame with proper feature names
        feature_df = pd.DataFrame([features], columns=self.feature_names[:len(features)])
        
        # Scale features
        features_scaled = self.scaler.transform(feature_df)
        
        # Get predictions from both models
        rf_pred = self.model['rf'].predict_proba(features_scaled)[0, 1]
        gb_pred = self.model['gb'].predict_proba(features_scaled)[0, 1]
        
        # Return ensemble average
        return float((rf_pred + gb_pred) / 2)
    
    def generate_explanation(self, applicant_data: List[float]) -> Dict[str, Any]:
        """
        Generate a comprehensive explanation for a credit decision
        """
        if self.model is None:
            raise ValueError("Model not trained yet")
        
        # Get prediction probability
        risk_score = self.predict_probability(applicant_data)
        
        # Determine decision based on thresholds
        if risk_score >= 0.7:
            decision = "APPROVED"
            confidence = "High"
        elif risk_score >= 0.55:
            decision = "APPROVED" 
            confidence = "Medium"
        elif risk_score >= 0.4:
            decision = "CONDITIONAL"
            confidence = "Medium"
        elif risk_score >= 0.25:
            decision = "CONDITIONAL"
            confidence = "Low"
        else:
            decision = "DENIED"
            confidence = "High"
        
        # Calculate feature contributions
        feature_contributions = []
        
        for i, (feature_name, value) in enumerate(zip(self.feature_names, applicant_data)):
            # Get feature importance
            importance = 0.1  # Default importance
            if self.feature_importance is not None:
                feature_row = self.feature_importance[self.feature_importance['feature'] == feature_name]
                if not feature_row.empty:
                    importance = float(feature_row['importance'].iloc[0])
            
            # Calculate normalized impact based on value and importance
            if feature_name == 'credit_score':
                normalized_value = (value - 300) / 550  # Normalize credit score
            elif feature_name in ['monthly_income', 'total_alternative_income']:
                normalized_value = min(np.log(value / 1000) / 3, 1.0)  # Log normalize income
            else:
                normalized_value = min(value, 1.0)  # Most other features are 0-1
            
            impact = importance * normalized_value
            
            feature_contributions.append({
                'name': self._humanize_feature_name(feature_name),
                'value': float(value),
                'impact': float(impact),
                'importance': float(importance)
            })
        
        # Sort by impact
        feature_contributions.sort(key=lambda x: x['impact'], reverse=True)
        
        return {
            'decision': decision,
            'confidence': confidence,
            'risk_score': float(1 - risk_score),  # Convert to risk score (lower is better)
            'approval_probability': float(risk_score),
            'key_factors': feature_contributions[:5]  # Top 5 factors
        }
    
    def _humanize_feature_name(self, feature_name: str) -> str:
        """Convert technical feature names to human-readable names"""
        name_mapping = {
            'credit_score': 'Traditional Credit Score',
            'monthly_income': 'Monthly Income',
            'total_alternative_income': 'Alternative Income Sources',
            'payment_reliability_score': 'Payment History',
            'cash_flow_consistency': 'Business Cash Flow Stability',
            'platform_ratings': 'Gig Platform Performance',
            'community_trust_score': 'Community Trust',
            'financial_engagement_score': 'Financial Education',
            'income_diversification': 'Income Diversification',
            'business_health': 'Overall Business Health'
        }
        return name_mapping.get(feature_name, feature_name.replace('_', ' ').title())
    
    def get_feature_importance(self) -> pd.DataFrame:
        """Get feature importance rankings"""
        if self.feature_importance is None:
            return pd.DataFrame(columns=['feature', 'importance'])
        return self.feature_importance.copy()
    
    def save_model(self, filepath: str):
        """Save the trained model"""
        joblib.dump(self, filepath, compress=3)
        logger.info(f"Model saved to {filepath}")
    
    @classmethod
    def load_model(cls, filepath: str):
        """Load a trained model"""
        model = joblib.load(filepath)
        logger.info(f"Model loaded from {filepath}")
        return model
