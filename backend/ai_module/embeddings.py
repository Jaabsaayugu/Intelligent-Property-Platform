from sentence_transformers import SentenceTransformer
import sys
import json

# Load model once when script starts
model = SentenceTransformer('all-MiniLM-L6-v2')

def generate_embedding(text: str):
    try:
        embedding = model.encode(text, normalize_embeddings=True)
        print(json.dumps(embedding.tolist()))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_text = sys.argv[1]
        generate_embedding(input_text)
    else:
        print(json.dumps({"error": "No text provided"}))