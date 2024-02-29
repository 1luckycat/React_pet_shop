let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwOTE1ODA1NywianRpIjoiZDQxMWU1YmEtMTA3Yy00ZDgwLThkZGUtMDk0NzA2MGM4MGMzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IkRyZWFtIFBldCBTaG9wIiwibmJmIjoxNzA5MTU4MDU3LCJjc3JmIjoiZWU3NGU4MjYtNzEzNy00ZmY4LWE4YzEtNDM3YWFmM2RkMTIzIiwiZXhwIjoxNzQwNjk0MDU3fQ.3fXb3pM4a7nrAGbHyCzXp_TTfZxICgXAQWyzEhSpeA0"
let userId = localStorage.getItem('uuid')


export const serverCalls = {
    getShop: async () => {
        const response = await fetch(`https://pet-shop-trial.onrender.com/api/shop`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data'), response.status
        }
        return await response.json()
    }
}

