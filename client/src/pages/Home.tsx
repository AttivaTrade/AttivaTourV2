import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Globe, Shield, Plane, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Wave Divider Component
function WaveDivider() {
  return (
    <div className="relative h-16 md:h-24 -mb-1">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
          fill="white"
        />
      </svg>
    </div>
  );
}

/**
 * Design Philosophy: Minimalismo Corporativo com Ênfase em Segurança
 * - Clareza absoluta em cada elemento
 * - Hierarquia visual forte guiando para o funil de vendas
 * - Confiança através da simplicidade
 * - Cores: Azul profundo (#0052CC), Verde suave (#10B981), Laranja quente (#FF6B35)
 */

export default function Home() {
  const [formData, setFormData] = useState({
    destination: "",
    departureDate: "",
    returnDate: "",
    travelers0to60: "0",
    travelers61to80: "0",
    travelers81to99: "0",
  });

  const [dollarRate, setDollarRate] = useState<number | null>(null);
  const [loadingDollar, setLoadingDollar] = useState(true);
  const [dollarDate, setDollarDate] = useState<string>("");

  useEffect(() => {
    const fetchDollarRate = async () => {
      try {
        setLoadingDollar(true);
        const response = await fetch(
          "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json"
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const rate = parseFloat(data[0].valor);
          setDollarRate(rate);
          setDollarDate(data[0].data);
        }
      } catch (error) {
        console.error("Erro ao buscar cotacao:", error);
        setDollarRate(5.45);
      } finally {
        setLoadingDollar(false);
      }
    };

    fetchDollarRate();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScrollToForm = () => {
    setTimeout(() => {
      const formElement = document.getElementById("cotacao");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.destination || !formData.departureDate || !formData.returnDate) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Construir mensagem para WhatsApp
    const totalTravelers = parseInt(formData.travelers0to60) + parseInt(formData.travelers61to80) + parseInt(formData.travelers81to99);
    if (totalTravelers === 0) {
      toast.error("Por favor, indique pelo menos 1 viajante");
      return;
    }

    const message = `Olá! Gostaria de cotar um seguro viagem com os seguintes dados:\n\n*Detalhes da Viagem:*\nDestino: ${formData.destination}\nData de Saída: ${formData.departureDate}\nData de Retorno: ${formData.returnDate}\n\n*Quantidade de Viajantes:*\nEntre 0 e 60 anos: ${formData.travelers0to60}\nEntre 61 e 80 anos: ${formData.travelers61to80}\nEntre 81 e 99 anos: ${formData.travelers81to99}\nTotal: ${totalTravelers}`;

    // Link do WhatsApp
    const whatsappNumber = "5511987917190"; // Número integrado
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Abrir WhatsApp
    window.open(whatsappLink, "_blank");

    // Feedback ao usuário
    toast.success("Redirecionando para WhatsApp...");

    // Limpar formulário
    setFormData({
      destination: "",
      departureDate: "",
      returnDate: "",
      travelers0to60: "0",
      travelers61to80: "0",
      travelers81to99: "0",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Plane className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Attiva Tour</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#cotacao" className="text-sm text-foreground hover:text-primary transition-colors">
              Cotação
            </a>
            <a href="#depoimentos" className="text-sm text-foreground hover:text-primary transition-colors">
              Depoimentos
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-32 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="heading-2xl text-white mb-6">Viaje Protegido com Attiva Tour</h1>
              <p className="text-lg text-white/90 mb-8">
                A Attiva Tour oferece proteção completa para suas viagens internacionais. Cobertura em mais de 200 países com a confiança da Europ Assistance.
              </p>
              <div className="flex gap-4 mb-8">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white" onClick={handleScrollToForm}>
                  Cotar Agora
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Saiba Mais
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  <span className="text-sm text-white">Emissão em Minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  <span className="text-sm text-white">Suporte 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  <span className="text-sm text-white">Melhor Preço</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029182891/CiADGtXm8rSWMRU6Lkke98/hero-banner_4495aeff.jpg"
                alt="Viajantes felizes"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg text-primary mb-4">Por Que Escolher Attiva Tour?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Somos especialistas em vender seguros de viagem com a confiança da Europ Assistance. Oferecemos as melhores coberturas e os melhores preços do mercado.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Proteção Completa",
                description: "Cobertura em mais de 200 países com assistência 24/7 em português",
              },
              {
                icon: Plane,
                title: "Processo Simples",
                description: "Cotação e emissão rápida pelo WhatsApp, sem complicações",
              },
              {
                icon: Globe,
                title: "Melhor Custo-Benefício",
                description: "Planos flexíveis com os melhores preços do mercado",
              },
            ].map((benefit, idx) => {
              const Icon = benefit.icon;
              const gradients = [
                "from-blue-500 to-cyan-400",
                "from-green-500 to-emerald-400",
                "from-orange-500 to-red-400",
              ];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-border hover:shadow-xl hover:scale-105 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className={`bg-gradient-to-br ${gradients[idx]} rounded-full w-16 h-16 flex items-center justify-center mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-primary">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <WaveDivider />



      {/* Quotation Form Section */}
      <section id="cotacao" className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-lg text-primary mb-4">Cotação Rápida - Attiva Tour</h2>
              <p className="text-lg text-muted-foreground">
                Preencha os dados abaixo e envie direto para o WhatsApp da Attiva Tour. Responderemos em minutos com a melhor cotação!
              </p>
            </div>

            <Card className="border-border shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-border">
                <CardTitle className="text-primary">Cotação de Seguro Viagem</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo. Todos os campos com * são obrigatórios.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Travel Information */}
                  <div className="space-y-4">
                    <h3 className="heading-md text-foreground">Detalhes da Viagem</h3>

                    <div>
                      <Label htmlFor="destination" className="text-sm font-medium">
                        Destino *
                      </Label>
                      <Select value={formData.destination} onValueChange={(value) => handleSelectChange("destination", value)}>
                        <SelectTrigger id="destination" className="mt-2">
                          <SelectValue placeholder="Selecione o destino" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nacional">Nacional</SelectItem>
                          <SelectItem value="america-norte">América do Norte</SelectItem>
                          <SelectItem value="caribe-mexico">Caribe e México</SelectItem>
                          <SelectItem value="europa">Europa</SelectItem>
                          <SelectItem value="america-sul-central">América do Sul e Central</SelectItem>
                          <SelectItem value="oriente-medio-oceania-asia-africa">Oriente Médio, Oceania, Ásia e África</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="departureDate" className="text-sm font-medium">
                          Data de Saída *
                        </Label>
                        <Input
                          id="departureDate"
                          name="departureDate"
                          type="date"
                          value={formData.departureDate}
                          onChange={handleInputChange}
                          className="mt-2"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="returnDate" className="text-sm font-medium">
                          Data de Retorno *
                        </Label>
                        <Input
                          id="returnDate"
                          name="returnDate"
                          type="date"
                          value={formData.returnDate}
                          onChange={handleInputChange}
                          className="mt-2"
                          min={formData.departureDate || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-3">Quantidade de Viajantes por Faixa Etária *</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="travelers0to60" className="text-xs font-medium text-muted-foreground">
                              Entre 0 e 60 anos
                            </Label>
                            <Input
                              id="travelers0to60"
                              name="travelers0to60"
                              type="number"
                              min="0"
                              max="10"
                              value={formData.travelers0to60}
                              onChange={handleInputChange}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="travelers61to80" className="text-xs font-medium text-muted-foreground">
                              Entre 61 e 80 anos
                            </Label>
                            <Input
                              id="travelers61to80"
                              name="travelers61to80"
                              type="number"
                              min="0"
                              max="10"
                              value={formData.travelers61to80}
                              onChange={handleInputChange}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="travelers81to99" className="text-xs font-medium text-muted-foreground">
                              Entre 81 e 99 anos
                            </Label>
                            <Input
                              id="travelers81to99"
                              name="travelers81to99"
                              type="number"
                              min="0"
                              max="10"
                              value={formData.travelers81to99}
                              onChange={handleInputChange}
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-border">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-accent hover:bg-accent/90 text-white font-semibold text-base h-12"
                    >
                      Enviar Cotação via WhatsApp
                    </Button>
                    
                    <div className="mt-4 text-center">
                      {loadingDollar ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Carregando...</span>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Dólar: <span className="font-semibold text-foreground">R$ {dollarRate?.toFixed(2)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* About Us Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-lg text-white mb-6">Sobre a Attiva Tour</h2>
              <p className="text-lg text-white/80 mb-4">
                A Attiva Tour é uma agência de turismo especializada em seguros de viagem, com anos de experiência no mercado. Somos parceiros oficiais da Europ Assistance, uma das maiores seguradoras de viagem do mundo.
              </p>
              <p className="text-lg text-white/80 mb-6">
                Nossa missão é oferecer proteção completa e confiável para seus clientes viajarem com tranquilidade. Contamos com uma equipe dedicada, disponível 24/7 para suporte em português.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-white">Mais de 200 países cobertos</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-white">Emissão em minutos</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-white">Suporte 24/7 em português</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-white">Parceria com Europ Assistance</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
                <p className="text-4xl font-bold text-accent mb-2">200+</p>
                <p className="text-white/80">Países Cobertos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
                <p className="text-4xl font-bold text-accent mb-2">24/7</p>
                <p className="text-white/80">Suporte 24 Horas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
                <p className="text-4xl font-bold text-accent mb-2">100%</p>
                <p className="text-white/80">Confiabilidade</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
                <p className="text-4xl font-bold text-accent mb-2">+5K</p>
                <p className="text-white/80">Clientes Satisfeitos</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-lg text-primary mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Milhares de viajantes confiam na Attiva Tour para suas viagens internacionais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                location: "São Paulo, SP",
                text: "Contratei o seguro da Attiva Tour para minha viagem à Europa e tive um problema com bagagem. O atendimento foi excelente!",
              },
              {
                name: "João Santos",
                location: "Rio de Janeiro, RJ",
                text: "Processo super rápido e fácil. Cotei pelo WhatsApp e em 5 minutos já tinha meu seguro emitido.",
              },
              {
                name: "Ana Costa",
                location: "Belo Horizonte, MG",
                text: "Melhor preço que encontrei no mercado. Recomendo a Attiva Tour para todos os meus amigos!",
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="border-border">
                <CardContent className="pt-6">
                  <p className="text-sm text-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Plane className="h-6 w-6" />
                <span className="text-lg font-bold">Attiva Tour</span>
              </div>
              <p className="text-sm text-white/70">
                Especialistas em seguros de viagem com a confiança da Europ Assistance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#cotacao" className="hover:text-white transition-colors">Cotar Seguro</a></li>
                <li><a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="https://wa.me/5511987917190" className="hover:text-white transition-colors">WhatsApp: (11) 98791-7190</a></li>
                <li><a href="mailto:contato@attivatrade.com.br" className="hover:text-white transition-colors">Email: contato@attivatrade.com.br</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Parceiros</h4>
              <p className="text-sm text-white/70">
                Seguros emitidos pela Europ Assistance Brasil
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/70">
            <p>&copy; 2026 Attiva Tour. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
