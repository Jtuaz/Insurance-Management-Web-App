import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const auth = inject(Auth);

    const token = auth.getToken();

    console.log('Interceptor token exists:', token !== null);

    if (token) {

        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log(
            'Authorization header added to:',
            req.url
        );

        return next(clonedRequest);
    }

    console.log(
        'No token found for:',
        req.url
    );

    return next(req);
};