import { ArrowLeft, Home } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/app/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/shared/components/ui/card"
import { ModeToggle } from "@/app/shared/components/theme/ModeToggle"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/" className="flex items-center gap-2 mr-6">
            <Home className="h-6 w-6" />
            <span className="font-semibold">Residencial Rubim</span>
          </Link>
          <div className="flex flex-1 items-center justify-between">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Login
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Política de Privacidade</CardTitle>
            <p className="text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                O Residencial Rubim está comprometido em proteger e respeitar sua privacidade. Esta 
                Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos 
                suas informações pessoais quando você utiliza nosso sistema de gestão.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Informações que Coletamos</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:
              </p>
              
              <h3 className="text-xl font-semibold mb-3">2.1 Informações Pessoais</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone</li>
                <li>CPF/CNPJ</li>
                <li>Endereço residencial</li>
                <li>Informações financeiras (para pagamentos)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">2.2 Informações de Uso</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Dados de acesso e navegação no sistema</li>
                <li>Endereço IP</li>
                <li>Informações do dispositivo</li>
                <li>Logs de atividade</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Como Utilizamos suas Informações</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Utilizamos suas informações pessoais para:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Fornecer e manter nossos serviços</li>
                <li>Processar pagamentos e transações</li>
                <li>Comunicar-se com você sobre serviços e atualizações</li>
                <li>Melhorar nossos serviços e experiência do usuário</li>
                <li>Cumprir obrigações legais e regulamentares</li>
                <li>Prevenir fraudes e garantir a segurança do sistema</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Base Legal para o Processamento</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Processamos seus dados pessoais com base nas seguintes bases legais:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Execução de contrato:</strong> Para cumprir obrigações contratuais</li>
                <li><strong>Interesse legítimo:</strong> Para melhorar nossos serviços e segurança</li>
                <li><strong>Consentimento:</strong> Quando você nos fornece consentimento explícito</li>
                <li><strong>Obrigação legal:</strong> Para cumprir exigências legais</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Compartilhamento de Informações</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Não vendemos, alugamos ou divulgamos suas informações pessoais a terceiros, exceto:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Com prestadores de serviços que nos auxiliam na operação do sistema</li>
                <li>Quando exigido por lei ou ordem judicial</li>
                <li>Para proteger nossos direitos legais ou propriedade</li>
                <li>Em caso de fusão, aquisição ou venda da empresa (com notificação prévia)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Segurança dos Dados</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Implementamos medidas de segurança técnicas e organizacionais para proteger 
                suas informações pessoais, incluindo:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares e seguros</li>
                <li>Treinamento regular da equipe sobre segurança de dados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Seus Direitos</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                De acordo com a LGPD, você tem os seguintes direitos sobre seus dados pessoais:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Confirmar a existência de tratamento</li>
                <li>Acessar seus dados</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                <li>Solicitar a portabilidade dos dados</li>
                <li>Revogar consentimento</li>
                <li>Ser informado sobre compartilhamento de dados</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Retenção de Dados</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir 
                as finalidades para as quais foram coletadas, ou conforme exigido por lei. 
                Após esse período, os dados serão anonimizados ou excluídos de forma segura.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Cookies e Tecnologias Similares</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência no 
                sistema, incluindo cookies de autenticação, preferências e análise de uso. 
                Você pode gerenciar suas preferências de cookies através das configurações 
                do seu navegador.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Alterações nesta Política</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos 
                sobre alterações significativas através do sistema ou por e-mail. A versão 
                mais recente estará sempre disponível em nosso sistema.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contato e Encarregado de Dados</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, 
                entre em contato com nosso Encarregado de Proteção de Dados:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>E-mail:</strong> dpo@residencialrubim.com.br<br />
                  <strong>Telefone:</strong> (11) 9999-9999<br />
                  <strong>Endereço:</strong> Rua das Palmeiras, 123 - São Paulo, SP<br />
                  <strong>Horário de atendimento:</strong> Segunda a sexta, das 9h às 18h
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}