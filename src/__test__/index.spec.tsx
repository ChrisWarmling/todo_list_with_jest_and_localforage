import React from 'react'
import {findByText, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../pages/index'

describe('Home', () => {
    test('Testing to have send button', async () => {
        render(<Home/>)
        expect(screen.getByRole('button', {name: 'Enviar'}))
    })
})