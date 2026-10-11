from app.services.news_radar import canonicalize_url, compute_content_hash

def test_canonicalize_url_strips_tracking():
    raw_url = "https://openai.com/index/introducing-o1/?utm_source=twitter&utm_medium=social&ref=newsletter/"
    clean = canonicalize_url(raw_url)
    assert "utm_source" not in clean
    assert "utm_medium" not in clean
    assert "ref" not in clean
    assert clean.startswith("https://openai.com/index/introducing-o1")

def test_content_hash_deterministic():
    text1 = "AlphaFold 3 Predicts Protein Complex"
    text2 = "AlphaFold 3 Predicts Protein Complex"
    text3 = "AlphaFold 3 Predicts Protein Complex 2"

    h1 = compute_content_hash(text1)
    h2 = compute_content_hash(text2)
    h3 = compute_content_hash(text3)

    assert h1 == h2
    assert h1 != h3
