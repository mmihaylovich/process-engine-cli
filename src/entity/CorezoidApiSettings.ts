class CorezoidApiSettings {
    url: string;
    keyLogin: string;
    keySecret: string;
    viaCookie = false;

    /**
     * extracted cookie from user session. It's not official and stable usage
     *  but can give you some more functionality
     */
    cookie: string;
}

export {CorezoidApiSettings}
