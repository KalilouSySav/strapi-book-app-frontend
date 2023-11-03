import './search.css'
import MeiliSearch from 'meilisearch'
import {useEffect, useState} from 'react'
import Book from '../components/Book' // This import was not added in the article.

function Search({searchValue}) {

  const [books, setBooks] = useState([])
    
    useEffect(() => {
      console.log('akdfmal', searchValue)
      const fetchData = async () => {
        const client = new MeiliSearch({
          host: 'https://52.15.54.185/',
          apiKey: 'f5e181da4165526ba3e6f1d456c7f712bb580b0efeefd5e82718bad2afa9b9ad',
        })
        const index = await client.getIndex('book')
        const booksData = await index.search(searchValue)
        setBooks(booksData.hits)
      }
      fetchData()
    }, [searchValue])

  return (
    <div className='searchPage wrapper'>
      <div className='searchPage__resultInfo'>
        <p>SEARCH RESULTS FOR</p>
        <h4>{searchValue}</h4>
      </div>
      <div className='books'>
        {searchValue && books?.map((book) => (
          <Book
            key={book.id}
            title={book.title}
            image={book.image}
            authors={book.authors}
            publisher={book.publisher}
            publishDate={book.publishedDate}
            id={book.id}
          />
        ))}
      </div>
    </div>
  )
}

export default Search