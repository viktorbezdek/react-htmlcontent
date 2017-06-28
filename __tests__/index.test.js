import React from 'react'
import expect from 'expect'
import { mount } from 'enzyme'
import HTMLContent from '../src/index'

const wrapper = mount(<HTMLContent>Lorem ipsum dolor si amet</HTMLContent>)

describe('(Component) HTMLContent', () => {
  it('renders without exploding', () => {
    expect(wrapper).toExist()
  })
})
