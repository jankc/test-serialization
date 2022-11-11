import { createS11n } from './hooks/createS11n'
import { z } from 'zod';
import { useState } from 'react';


export const Count = () => {
    const countSchema = z.number().int().min(0);

    const [serialize, deserialize] = createS11n({
        key: 'count',
        schema: countSchema,
        defaultValue: 7,
    })

    const [count, setCount] = useState(deserialize())

    return (
        <button onClick={() => {
            setCount((count) => count + 1);
            serialize(count + 1);
        }}>
            count is {count}
        </button>
    )
}