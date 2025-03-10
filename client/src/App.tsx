import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [sources, setSources] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedSourceIndex, setSelectedSourceIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    setIsLoading(true)
    setError('')
    setResponse('')
    setSources([])
    setSearchQuery('')
    setSelectedSourceIndex(null)
    
    try {
      const res = await axios.post('http://localhost:8000/prompt', {
        message: prompt
      })
      
      // 配列形式のレスポンスから文章だけを抽出
      if (Array.isArray(res.data.response) && res.data.response.length > 0) {
        // 最初の要素を使用（文章テキスト）
        setResponse(res.data.response[0]);
      } 
      // 文字列の場合はそのまま使用
      else if (typeof res.data.response === 'string') {
        setResponse(res.data.response);
      }
      
      // ソース情報の処理
      if (res.data.sources && Array.isArray(res.data.sources)) {
        // URL文字列の配列をそのまま保存
        setSources(res.data.sources);
      }

      // クエリ文字列の設定
      if (res.data.query) {
        setSearchQuery(res.data.query);
      }
    } catch (err) {
      console.error('Error sending prompt:', err)
      setError('サーバーとの通信に失敗しました。サーバーが起動しているか確認してください。')
    } finally {
      setIsLoading(false)
    }
  }

  // URLからドメイン名を抽出し、読みやすい形式に変換する
  const extractDomainFromUrl = (urlString: string): string => {
    try {
      const url = new URL(urlString);
      const domain = url.hostname
        .replace('www.', '')
        .split('.')
        .slice(0, -1)
        .join('.');
      
      // 最初の文字を大文字に
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch (e) {
      return 'Unknown Source';
    }
  };

  // ソースリンクがクリックされたときの処理
  const handleSourceClick = (index: number, url: string) => {
    setSelectedSourceIndex(index);
    
    // 別タブでURLを開く
    window.open(url, '_blank');
  };

  return (
    <div className="container">
      <header className="app-header">
        <div className="header-content">
          <h1>Bing Search App</h1>
        </div>
      </header>

      <main className="main-content">
        <form onSubmit={handleSubmit} className="prompt-form">
          <div className="input-group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="質問を入力してください..."
              rows={4}
              className="prompt-input"
            />
          </div>
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? '送信中...' : '送信'}
          </button>
        </form>
        
        {error && <div className="error-message">{error}</div>}
        
        {isLoading && <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">回答を生成中...</div>
        </div>}
        
        {response && (
          <div className="results-container">
            {searchQuery && (
              <div className="search-query-card">
                <h2 className="card-title">検索クエリ</h2>
                <div className="search-query-content">
                  <p>{searchQuery}</p>
                  <button 
                    onClick={() => window.open(`https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank')}
                    className="search-button"
                  >
                    <span className="search-icon">🔍</span>
                    Bingで検索
                  </button>
                </div>
              </div>
            )}
            <div className="response-card">
              <h2 className="card-title">回答</h2>
              <div className="response-content">
                {response}
              </div>
            </div>
            
            {sources.length > 0 && (
              <div className="source-links-container">
                <h2 className="sources-title">情報源</h2>
                <div className="source-links-list">
                  {sources.map((url, index) => (
                    <button
                      key={index}
                      className={`source-button ${selectedSourceIndex === index ? 'source-button-active' : ''}`}
                      onClick={() => handleSourceClick(index, url)}
                    >
                      <span className="source-icon">📄</span>
                      <span className="source-label">{extractDomainFromUrl(url)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 kohei3110 Bing Search App</p>
      </footer>
    </div>
  )
}

export default App