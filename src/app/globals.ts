import apiConfig from "./apiconfig.json" 

const configObj = apiConfig as any
const currSetting = configObj.current_setting
const settingsValue = configObj.settings[currSetting]

/** Variables globales */
export const API_SERVER_IP = settingsValue.host
export const API_SERVER_PORT = settingsValue.port
export const API_SERVER_DEFAULT_VER = settingsValue.default_ver
export const API_SERVER_BASE_URL = "http://" + API_SERVER_IP + ":" + API_SERVER_PORT 
                                            + "/" + API_SERVER_DEFAULT_VER + "/"