describe('Teste Básico do Cypress', () => {
  it('Deve funcionar corretamente', () => {
    cy.visit('https://example.com')
    cy.contains('Example Domain')
    cy.log('✅ Cypress está funcionando!')
  })
})
