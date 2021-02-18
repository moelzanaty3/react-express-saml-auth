import axios from 'axios'
import React, { useEffect, useState } from 'react'
import logging from './config/logging'

export interface IApplicationProps {}

const Application: React.FunctionComponent<IApplicationProps> = (props) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [email, setEmail] = useState<string>('')

    useEffect(() => {
        logging.info('Initiating SAML check.', 'SAML')
        const isCancel = false
        const fetchData = async () => {
            try {
                if (!isCancel) {
                    const {
                        data: {
                            user: { nameID }
                        }
                    } = await axios.get('http://localhost:8080/whoami', {
                        withCredentials: true
                    })

                    if (nameID) {
                        setEmail(nameID)
                        setLoading(false)
                    } else {
                        RedirectToLogin()
                    }
                }
            } catch (error) {
                logging.error(error, 'SAML')
                RedirectToLogin()
            }
        }
        if (!isCancel) {
            fetchData()
        }
    }, [])

    const RedirectToLogin = () => {
        window.location.replace('http://localhost:8080/login')
    }

    if (loading) return <p>loading ...</p>

    return <p>Hello {email}!</p>
}

export default Application
