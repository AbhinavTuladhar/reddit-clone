import { useState, useEffect } from 'react'
import axios, { AxiosResponse } from 'axios'

interface FetchResult<T> {
  data: T | null,
  isLoading: boolean,
  error: Error | null
}

const useFetch = <T>(url: string): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async (url: string) => {
    setIsLoading(true)

    try {
      const response: AxiosResponse<T> = await axios.get(url)

      setData(response.data)
      setError(null)
    } catch (error: any) {
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData(url)
  }, [url])

  return { data, isLoading, error }
}

export default useFetch