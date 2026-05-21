import api from './api'

const dealerService = {
  getAllDealers: async () => {
    try {
      // Fix: The api interceptor already returns response.data, so we just return the response directly.
      const response = await api.get('/dealers')
      return response
    } catch (error) {
      console.error('Error fetching dealers:', error)
      throw error.response?.data?.message || 'An error occurred while fetching dealers.'
    }
  },
}

export default dealerService
