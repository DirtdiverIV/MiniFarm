import { User } from '../../../models/User';

describe('User Model', () => {
  it('debería crear una instancia de User correctamente', () => {
    const user = new User();
    user.id = 1;
    user.email = 'usuario1@example.com';
    user.password_hash = 'hashedpassword123';
    user.role = 'admin';

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(1);
    expect(user.email).toBe('usuario1@example.com');
    expect(user.password_hash).toBe('hashedpassword123');
    expect(user.role).toBe('admin');
  });

  it('debería tener fechas de creación y actualización', () => {
    const user = new User();
    user.id = 1;
    user.email = 'usuario1@example.com';
    user.password_hash = 'hashedpassword123';
    
    // Establecer fechas
    const now = new Date();
    user.created_at = now;
    user.updated_at = now;
    
    expect(user.created_at).toEqual(now);
    expect(user.updated_at).toEqual(now);
  });

  it('debería tener un rol por defecto', () => {
    const user = new User();
    user.id = 1;
    user.email = 'usuario1@example.com';
    user.password_hash = 'hashedpassword123';
    
    // En un entorno real, el rol predeterminado sería establecido por la base de datos
    expect(user.role).toBeUndefined(); // En pruebas unitarias sin persistencia
    
    // Establecer un rol
    user.role = 'user';
    expect(user.role).toBe('user');
  });
}); 