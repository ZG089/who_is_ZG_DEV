// @refresh reload
import { StartClient, mount } from '@solidjs/start/client'

// Note: Importing the global styles here is important, this is to prevent FOUC
import './app.scss'

mount(() => <StartClient />, document.body)
