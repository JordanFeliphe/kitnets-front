import { ArrowLeft, Home } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/app/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/shared/components/ui/card"
import { ModeToggle } from "@/app/shared/components/theme/ModeToggle"

export default function TermsOfService() {
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
            <CardTitle className="text-3xl">Termos de Serviço</CardTitle>
            <p className="text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ao acessar e utilizar o sistema de gestão do Residencial Rubim, você concorda em cumprir 
                e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com 
                qualquer parte destes termos, não deve utilizar nosso sistema.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Uso do Sistema</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                O sistema é destinado exclusivamente para gestão administrativa do Residencial Rubim. 
                O acesso é restrito a:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Administradores autorizados</li>
                <li>Funcionários com permissões específicas</li>
                <li>Moradores com acesso limitado às suas informações</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Responsabilidades do Usuário</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ao utilizar o sistema, você se compromete a:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Utilizar o sistema apenas para fins autorizados</li>
                <li>Não compartilhar informações confidenciais com terceiros não autorizados</li>
                <li>Reportar imediatamente qualquer uso não autorizado de sua conta</li>
                <li>Manter suas informações de contato atualizadas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Proteção de Dados</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Todos os dados pessoais coletados e processados pelo sistema são tratados de acordo 
                com nossa Política de Privacidade e em conformidade com a Lei Geral de Proteção de 
                Dados (LGPD) e demais legislações aplicáveis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Limitações de Responsabilidade</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                O Residencial Rubim não se responsabiliza por:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Interrupções temporárias no sistema devido a manutenções programadas</li>
                <li>Perda de dados causada por falhas técnicas não previsíveis</li>
                <li>Uso inadequado do sistema por parte dos usuários</li>
                <li>Danos indiretos decorrentes do uso do sistema</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Modificações nos Termos</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações 
                entrarão em vigor imediatamente após sua publicação no sistema. É responsabilidade 
                do usuário revisar periodicamente estes termos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Término do Acesso</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                O acesso ao sistema pode ser suspenso ou encerrado a qualquer momento, sem aviso 
                prévio, em caso de violação destes termos ou por decisão administrativa do 
                Residencial Rubim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Contato</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Para dúvidas sobre estes termos, entre em contato conosco:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>E-mail:</strong> admin@residencialrubim.com.br<br />
                  <strong>Telefone:</strong> (11) 9999-9999<br />
                  <strong>Endereço:</strong> Rua das Palmeiras, 123 - São Paulo, SP
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}