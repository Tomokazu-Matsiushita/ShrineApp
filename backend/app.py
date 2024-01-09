# app.py
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import openai

app = Flask(__name__)
cors = CORS(app, resources={
    r"/search": {
        "origins": ["http://localhost:3000"],
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET"]
    }
})
cors = CORS(app, origins=["*"])

DATABASE_PATH = 'trial.db'

def search_in_db(title):
    # Connect to the SQLite database
    connection = sqlite3.connect(DATABASE_PATH)
    cursor = connection.cursor()

    # Execute a SQL query to search for temples by title
    cursor.execute("SELECT * FROM temples_table WHERE title LIKE ?", ('%' + title + '%',))
    results = cursor.fetchall()

    # Close the database connection
    connection.close()

    # Convert the results to a list of dictionaries
    temples = []
    for row in results:
        if len(row) == 5:
            # Assuming the schema is (id, Href, Title, Latitude, Longitude) and id is not needed
            temples.append({'Href': row[0], 'Title': row[1], 'Latitude': row[2], 'Longitude': row[3], 'Content': row[4]})
        else:
            # Handle the error or log it
            print(f"Error: Expected 5 elements in row, but got {len(row)}: {row}")

    return temples

# @app.route('/search', methods=['GET'])
# def search_title():
#     title = request.args.get('title')
#     if title is None:
#         return "Error: No title field provided. Please specify a title.", 400
#     result = search_in_db(title)
#     if not result:
#         return jsonify({'error': 'Title not found'}), 404
#     # Here we get the Href of the first result (if there are multiple results, appropriate logic needs to be applied)
#     href = result[0]['Href']
#     return jsonify({'href': href})
@app.route('/search')
def search():
    title = request.args.get('title', '')
    results = search_in_db(title)
    return jsonify(results)  # resultsは常にリストであるべきです

@app.route('/fetch_url', methods=['GET'])
def fetch_url():
    url = request.args.get('url')
    print(f"Fetching URL: {url}") 
    response = requests.get(url)
    
    # Check the status code of the response
    if response.status_code == 200:
        print('Success!')
    else:
        print('Failed to fetch the page. Status code:', response.status_code)

    # Optionally, print the response headers
    print('Response headers:', response.headers)

    # Print the first 500 characters of the response body
    print('Response body snippet:', response.text[:500])

    # Continue processing with BeautifulSoup or return an error
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        # Find all paragraph tags without a class attribute
        paragraphs = soup.find_all('p', class_=False)

        # Combine the text from all the paragraphs
        text = ' '.join(paragraph.get_text() for paragraph in paragraphs)
    else:
        return jsonify({'error': 'Failed to fetch the page'}), 500

    # OpenAI API call to summarize the text
    openai.api_key = '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'
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt="Summarize the following text:\n\n" + text,
        temperature=0.3,
        max_tokens=100
    )
    summary = response.choices[0].text.strip()
    print(summary)
    return summary

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
