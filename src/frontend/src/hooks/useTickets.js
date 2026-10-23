import { useEffect, useState } from 'react';
import { ticketsApi } from '../api/tickets.api';

export function useTickets(filters) {
    const [state, setState] = useState({ data: null, loading: true, error: null });

    useEffect(() => {
        let huy = false;
        // eslint-disable-next-line
        setState({ data: null, loading: true, error: null });
        
        ticketsApi.danhSach(filters)
            .then(data => { if (!huy) setState({ data, loading: false, error: null }); })
            .catch(err => { if (!huy) setState({ data: null, loading: false, error: err }); });
            
        return () => { huy = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filters)]);

    return state;
}