import React from 'react'
import { findByText, render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../pages/index'

const wait = (amount = 0) => {
    return new Promise((resolve) => setTimeout(resolve, amount));
};

const actWait = async (amount = 0) => {
    await act(async () => {
        await wait(amount);
    });
};

describe('Home', () => {    
    beforeEach(cleanup)
    test('Testing to have send button', async () => {
        const { getByText, getByTestId } = render(<Home />)

        expect(getByTestId("todo-list")).toContainElement(
            getByText("Enviar")
        )
    })
    test('Testing to have input element', async () => {
        render(<Home />)
        const inputTd = screen.getByTestId('todo-input')
        expect(inputTd).toBeInTheDocument()
        expect(inputTd).toHaveAttribute('type', 'text')
    })
    test('Testing send event', async () => {
        render(<Home />)
        const setup = () => {
            const input = screen.getByTestId('todo-input')
            return {
                input,
                ...screen,
            }
        }
        const { input } = setup()
        fireEvent.change(input, { target: { value: 'teste jest' } })
        await actWait()
        fireEvent.click(screen.getByText("Enviar"))
        await actWait()
        expect(screen.getByTestId('todo-list')).toContainElement(
            screen.getByText('teste jest')
        )
    })
    test('Testing remove todo', async () => {
        render(<Home />)
        const setup = () => {
            const input = screen.getByTestId('todo-input')
            return {
                input,
                ...screen,
            }
        }
        const { input } = setup()
        fireEvent.change(input, { target: { value: 'teste jest 2' } })
        await actWait()
        fireEvent.click(screen.getByText("Enviar"))
        await actWait()
        fireEvent.click(screen.getByTestId("teste jest 2"))
        await actWait()
        // expect(screen.getByTestId("todo-itens")).toBeEmptyDOMElement()
    })
})