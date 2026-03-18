# Generates statistics and visualizations for any uploaded CSV file.
# Returns a clean dict that Flask can send directky to FLASK

import os
import base64
import io
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend for matplotlib
import matplotlib.pyplot as plt
import seaborn as sns

def fig_to_base64(fig):
    '''
    Converts a matplotlib figure to a base64 string so it can be sent as JSON
    '''
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)  # Close the figure to free memory
    return img_str

def run_eda(csv_path, target_col=None):
    """
    Full EDA on a CSV file.

    Args:
        csv_path   : path to uploaded CSV
        target_col : optional — if provided, generates target distribution chart

    Returns a dict with:
        - overview    : row/col count, duplicate count
        - missing     : missing value info per column
        - dtypes      : data type of each column
        - stats       : numeric column statistics
        - categoricals: value counts for categorical columns
        - charts      : dict of base64-encoded PNG chart images
    """
    
    df=pd.read_csv(csv_path)
    
    # 1. Overview
    overview = {
        'rows': int(df.shape[0]),
        'columns': int(df.shape[1]),
        'duplicate_rows': int(df.duplicated().sum()),
        'total_missing': int(df.isnull().sum().sum()),
        'column_names': df.columns.tolist(),
        
    }
    
    # 2. Missing values
    missing=[]
    for col in df.columns:
        count = int(df[col].isnull().sum())
        if count > 0:
            missing.append({
                'column': col,
                'missing' : count,
                'percentage': round(count/len(df)*100,2)
            })
    
    # 3. Data types
    dtypes = {col:str(dtype) for col,dtype in df.dtypes.items()}

    # 4. Numeric stats  
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    stats=[]
    for col in numeric_cols:
        stats.append({
            'column' : col,
            'mean': round(float(df[col].mean()),3),
            'median': round(float(df[col].median()),3),
            'std': round(float(df[col].std()),3),
            'min': round(float(df[col].min()),3),
            'max': round(float(df[col].max()),3),
        })    
    
    # 5. Categorical value counts
    cat_cols = df.select_dtypes(include=['object']).columns.tolist()
    categoricals=[]
    for col in cat_cols:
        counts= df[col].value_counts().head(10)
        categoricals.append({
            'column': col,
            'values': counts.index.tolist(),
            'counts': counts.values.tolist(),
        })
    
    # 6. Charts
    charts={}
    
    # Chart 1: Missing values bar chart
    if missing:
        fig, ax= plt.subplots(figsize=(8,4))
        miss_df = pd.DataFrame(missing)
        ax.barh(miss_df['column'], miss_df['percentage'], color='#E05C5C')
        ax.set_xlabel('Missing %')
        ax.set_title('Missing Values per Column')
        plt.tight_layout()
        charts['missing_values'] = fig_to_base64(fig)
        
    # Chart 2: Distribution plots for numeric columns (max 6)
    if numeric_cols:
        cols_to_plot = numeric_cols[:6]
        fig, axes = plt.subplots(1,len(cols_to_plot), figsize= (4 * len(cols_to_plot),4))
        if len(cols_to_plot) ==1:
            axes= [axes]
        for ax, col in zip(axes, cols_to_plot):
            df[col].dropna().hist(ax=ax, bins=20, color='#4A90D9',edgecolor='white')
            ax.set_title(col)
            ax.set_xlabel('')
        plt.suptitle('Numeric Column Distributions', y = 1.02)
        plt.tight_layout()
        charts['distributions'] = fig_to_base64(fig)
    
    # Chart 3: Correlation heatmap (only if 2+ numeric columns)
   
    if len(numeric_cols) >= 2:
        corr = df[numeric_cols].corr()
        fig = plt.figure(figsize=(8, 6))
        ax = fig.add_subplot(111)
        sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm',
                    ax=ax, linewidths=0.5, cbar=True)
        ax.set_title('Correlation Heatmap')
        fig.tight_layout()
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
        buf.seek(0)
        charts['correlation'] = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)
        
    # Chart 4 : Target column distribution (if target_col provided)
    if target_col and target_col in df.columns:
        fig, ax = plt.subplots(figsize=(6,4))
        df[target_col].value_counts().plot(kind='bar', color='#5B8CDB', edgecolor='white', ax=ax)
        ax.set_title(f'Distribution of Target Column: {target_col}')
        ax.set_xlabel('')
        plt.xticks(rotation=45)
        plt.tight_layout()
        charts['target_distribution'] = fig_to_base64(fig)
        
    return {
        'overview': overview,
        'missing': missing,
        'dtypes': dtypes,
        'stats': stats,
        'categoricals': categoricals,
        'charts': charts
    }