import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Trophy, Weight, Star, Plus, Dumbbell } from "lucide-react";
import WorkoutCard from "@/components/workout/workout-card";
import WeeklyCalendar from "@/components/calendar/weekly-calendar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: todayWorkouts, isLoading: workoutsLoading } = useQuery({
    queryKey: ["/api/workouts/today"],
  });

  const { data: featuredPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/marketplace/featured"],
  });

  const { data: metrics } = useQuery({
    queryKey: ["/api/metrics"],
  });

  if (statsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Bem-vindo de volta!</h2>
            <p className="text-gray-600">Vamos continuar sua jornada fitness</p>
          </div>
          <Button className="bg-primary text-white hover:bg-red-600">
            <Plus className="w-4 h-4 mr-2" />
            Novo Treino
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Flame className="text-primary h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Treinos Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.todayWorkouts ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Trophy className="text-accent h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Sequência</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.streak ?? 0} dias</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Weight className="text-blue-600 h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Peso Atual</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.currentWeight ?? '0'}kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Star className="text-purple-600 h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">Ranking</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.ranking ?? '#-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's Workouts */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Treinos de Hoje</h3>
        {workoutsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(todayWorkouts || []).map((userWorkout: any) => (
              <WorkoutCard 
                key={userWorkout.id} 
                userWorkout={userWorkout}
              />
            ))}
            {(!todayWorkouts || (todayWorkouts || []).length === 0) && (
              <div className="col-span-2 text-center py-12 text-gray-500">
                <p>Nenhum treino agendado para hoje.</p>
                <Button className="mt-4" variant="outline">
                  Agendar Treino
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Weekly Calendar */}
      <WeeklyCalendar />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Recent Videos */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Vídeos de Treino</h3>
              <Button variant="link" className="text-primary">Ver todos</Button>
            </div>
            <div className="space-y-4">
              {[
                { title: "Supino Reto - Técnica Perfeita", duration: "8:45 min", thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=80&fit=crop" },
                { title: "HIIT Cardio Intenso", duration: "12:30 min", thumbnail: "https://images.unsplash.com/photo-1549476464-37392f717541?w=120&h=80&fit=crop" },
                { title: "Levantamento Terra", duration: "15:20 min", thumbnail: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=120&h=80&fit=crop" }
              ].map((video, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="relative">
                    <img src={video.thumbnail} alt={video.title} className="w-20 h-14 rounded-lg object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{video.title}</h4>
                    <p className="text-gray-600 text-sm">{video.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Body Metrics */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Progresso Corporal</h3>
              <Button variant="link" className="text-primary">
                <Plus className="w-4 h-4 mr-1" />Adicionar
              </Button>
            </div>
            {metrics ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Weight className="text-blue-600 h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Peso</p>
                      <p className="text-gray-600 text-sm">Última medição</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{metrics?.weight ?? '0'} kg</p>
                    <p className="text-accent text-sm">-0.8 kg</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <div className="text-purple-600 h-4 w-4 flex items-center justify-center text-xs font-bold">%</div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Gordura Corporal</p>
                      <p className="text-gray-600 text-sm">Bioimpedância</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{metrics?.bodyFat ?? '0'}%</p>
                    <p className="text-accent text-sm">-1.2%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <Dumbbell className="text-green-600 h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Massa Muscular</p>
                      <p className="text-gray-600 text-sm">Bioimpedância</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{metrics?.muscleMass ?? '0'} kg</p>
                    <p className="text-accent text-sm">+0.5 kg</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                      <div className="text-yellow-600 h-4 w-4 flex items-center justify-center">💧</div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Hidratação</p>
                      <p className="text-gray-600 text-sm">Bioimpedância</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{metrics?.hydration ?? '0'}%</p>
                    <p className="text-red-500 text-sm">-2.1%</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma medição registrada ainda.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Featured Marketplace Plans */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Marketplace de Treinos</h3>
            <p className="text-gray-600">Encontre treinos criados por personal trainers profissionais</p>
          </div>
          <Button className="bg-primary text-white hover:bg-red-600">
            Ver Marketplace
          </Button>
        </div>
        
        {plansLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(featuredPlans || []).slice(0, 3).map((plan: any) => (
              <Card key={plan.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={plan.imageUrl} 
                    alt={plan.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary text-white">
                    Bestseller
                  </Badge>
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    R$ {plan.price}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <img 
                      src={plan.trainer?.profileImage} 
                      alt={plan.trainer?.firstName}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-gray-600 text-sm">
                      {plan.trainer?.firstName} {plan.trainer?.lastName}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{plan.name}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-gray-600 text-sm">
                        {plan.rating} ({plan.reviewCount})
                      </span>
                    </div>
                    <span className="text-gray-600 text-sm">{plan.duration} semanas</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
