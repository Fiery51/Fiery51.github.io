from flask import Flask, render_template, jsonify
import pandas as pd
from collections import Counter
from nltk.corpus import stopwords
import re
import nltk

app = Flask(__name__)

# Download the NLTK stop words if not already downloaded
nltk.download("stopwords")

# Read CSV data
# df = pd.read_csv("chat_data.csv")

# Initialize lists to store word counts for '0' and '1' sentiments
word_counts_0 = []
word_counts_1 = []

# Get the list of NLTK stop words
stop_words = set(stopwords.words("english"))

# Iterate over each row in the DataFrame
for idx, row in df.iterrows():
    text = row["text"]

    # Check if text is a list and concatenate its elements into a single string
    if isinstance(text, list):
        text = " ".join(map(str, text))

    words = re.findall(r"\w+", text)  # Split the text into words using regex
    sentiment = int(row["class"])
    words = [
        word.lower() for word in words if word.lower() not in stop_words
    ]  # Filter out stop words
    if sentiment == 0:
        word_counts_0.extend(words)
    elif sentiment == 1:
        word_counts_1.extend(words)

# Count the occurrences of words for both '0' and '1' sentiments
word_counts_0 = pd.Series(word_counts_0).value_counts()
word_counts_1 = pd.Series(word_counts_1).value_counts()

# Combine the counts into a single DataFrame
word_counts_combined = pd.DataFrame(
    {
        "Word": word_counts_0.index,
        "Count": word_counts_0.values,
        "Sentiment": "0",
    }
)

# Add the counts for '1' sentiment
word_counts_combined = word_counts_combined.append(
    pd.DataFrame(
        {
            "Word": word_counts_1.index,
            "Count": word_counts_1.values,
            "Sentiment": "1",
        }
    )
)

# Sort by total count
word_counts_combined = word_counts_combined.sort_values(
    by="Count", ascending=False
).head(50)


# Define a route to render the HTML template
@app.route("/")
def index():
    return render_template("index.html")


# Define an endpoint to serve the data as JSON
@app.route("/data")
def get_data():
    return jsonify(word_counts_combined.to_dict(orient="records"))


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
